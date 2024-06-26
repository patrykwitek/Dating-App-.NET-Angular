﻿using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;
    private readonly IUnitOfWork _unitOfWork;

    public UsersController(
        IMapper mapper,
        IPhotoService photoService,
        IUnitOfWork unitOfWork
    )
    {
        _mapper = mapper;
        _photoService = photoService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
        userParams.CurrentUsername = User.GetUsername();

        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = (gender == "male") ? "female" : "male";
        }

        var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        return await _unitOfWork.UserRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        string username = User.GetUsername();
        AppUser user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        // note: przekazuje dane z memberUpdateDto do user ale nie zapisuje zmian w bazie
        _mapper.Map(memberUpdateDto, user);

        // note: zapisuje zmiany do bazy
        if (await _unitOfWork.Complete())
        {
            // note: informuje użytkownika, że odpowiedź jest prawidłowa, jednak nie ma potrzeby nic zwracać
            return NoContent();
        }

        return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var username = User.GetUsername();
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

        if (user == null)
        {
            return NotFound();
        }

        var result = await _photoService.AddPhotoAsync(file);

        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count() == 0)
        {
            photo.IsMain = true;
        }

        user.Photos.Add(photo);

        if (await _unitOfWork.Complete())
        {
            return CreatedAtAction(
                nameof(GetUser),
                new { username = user.UserName },
                _mapper.Map<PhotoDto>(photo)
            );
        }

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)
        {
            return NotFound();
        }

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo == null)
        {
            return NotFound();
        }

        if (photo.IsMain)
        {
            return BadRequest("It is already the main photo");
        }

        var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);
        if (currentMain != null)
        {
            currentMain.IsMain = false;
        }

        photo.IsMain = true;

        if (await _unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Problem setting the main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);

        if (photo == null)
        {
            return NotFound();
        }

        if (photo.IsMain)
        {
            return BadRequest("You can't delete your main photo");
        }

        if (photo.PublicId != null)
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
        }

        user.Photos.Remove(photo);

        if (await _unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("Problem with deleting photo");
    }
}
