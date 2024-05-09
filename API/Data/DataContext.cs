using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

// note: starsza wersja przed zaimplementowaniem Identity dziedziczyła z DbContext
public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    // note: starsza wersja przed zaimplementowaniem Identity, IdentityDbContext posiada DbSet Users
    // public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>()
            .HasMany(user => user.UserRoles)
            .WithOne(user => user.User)
            .HasForeignKey(user => user.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(user => user.UserRoles)
            .WithOne(user => user.Role)
            .HasForeignKey(user => user.RoleId)
            .IsRequired();

        builder.Entity<UserLike>()
            .HasKey(key => new { key.SourceUserId, key.TargetUserId }); // note: tworzy podwójny klucz podstawowy

        // note: dzięki temu tworzymy relacje wiele do wielu
        builder.Entity<UserLike>()
            .HasOne(sourceUser => sourceUser.SourceUser)
            .WithMany(likeUser => likeUser.LikedUsers)
            .HasForeignKey(sourceUserId => sourceUserId.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
            .HasOne(sourceUser => sourceUser.TargetUser)
            .WithMany(likeUser => likeUser.LikedByUsers)
            .HasForeignKey(sourceUserId => sourceUserId.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>()
            .HasOne(user => user.Recipient)
            .WithMany(message => message.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>()
            .HasOne(user => user.Sender)
            .WithMany(message => message.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
