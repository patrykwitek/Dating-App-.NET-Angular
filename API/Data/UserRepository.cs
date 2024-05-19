using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            // note: starsza wersja bez stronnicowania
            // wcześniejsza wersja zwracała IEnumerable, teraz PagedList
            // return await _context.Users
            //     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //     .ToListAsync();

            // note: wersja stronnicowania bez uwzględnienia plci użytkownika
            // var query = _context.Users
            //     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            //     .AsNoTracking(); // note: no tracking sprawia, że operacja nie będzie następnie śledzona

            var query = _context.Users.AsQueryable();

            query = query.Where(user => user.UserName != userParams.CurrentUsername);
            query = query.Where(user => user.Gender == userParams.Gender);

            DateOnly maxDateOfBirthday = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            DateTime maxDateOfBirthdayDateTime = new DateTime(maxDateOfBirthday.Year, maxDateOfBirthday.Month, maxDateOfBirthday.Day);

            DateOnly minDateOfBirthday = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
            DateTime minDateOfBirthdayDateTime = new DateTime(minDateOfBirthday.Year, minDateOfBirthday.Month, minDateOfBirthday.Day);

            query = query.Where(user => user.DateOfBirth <= minDateOfBirthdayDateTime && user.DateOfBirth >= maxDateOfBirthdayDateTime);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(user => user.Created),
                _ => query.OrderByDescending(user => user.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                userParams.PageNumber,
                userParams.PageSize
            );
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                .Where(user => user.UserName == username)
                .Select(user => user.Gender)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}