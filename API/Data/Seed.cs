using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        // note: starsza wersja przed zaimplementowaniem Identity
        // public static async Task SeedUsers(DataContext context)
        // {
        //     if(await context.Users.AnyAsync())
        //     {
        //         return;
        //     }

        //     var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        //     var options = new JsonSerializerOptions
        //     {
        //         PropertyNameCaseInsensitive = true
        //     };

        //     var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        //     foreach(var user in users)
        //     {
        //         // note: starsza wersja przed zaimplementowaniem IdentityUser
        //         // using var hmac = new HMACSHA512();

        //         user.UserName = user.UserName.ToLower();
        //         // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("$tr0ngPas$w0Rd"));
        //         // user.PasswordSalt = hmac.Key;

        //         context.Users.Add(user);
        //     }

        //     await context.SaveChangesAsync();
        // }

        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync())
            {
                return;
            }

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "$tr0ngPas$w0Rd");

                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "$tr0ngPas$w0Rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}