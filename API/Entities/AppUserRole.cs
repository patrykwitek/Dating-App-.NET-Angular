using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    // note: Jest to klasa łącząca User i Role
    public class AppUserRole : IdentityUserRole<int>
    {
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}