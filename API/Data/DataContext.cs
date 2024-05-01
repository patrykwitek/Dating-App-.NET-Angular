using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder) 
    {
        base.OnModelCreating(builder);

        builder.Entity<UserLike>()
            .HasKey(key => new {key.SourceUserId, key.TargetUserId}); // note: tworzy podwójny klucz podstawowy

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
    }
}
