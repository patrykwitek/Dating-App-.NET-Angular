﻿using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class HTTPResponseController : BaseApiController
{
    private readonly DataContext _context;

    public HTTPResponseController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secret text";
    }

    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        AppUser user = _context.Users.Find(-1);
        if(user is null) return NotFound();
        return user;
    }

    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        AppUser user = _context.Users.Find(-1);
        string userToReturn = user.ToString();
        return userToReturn;
    }

    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("this was not a good request");
    }
}
