using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.Models;

public partial class SalesDbContext : DbContext
{
    public SalesDbContext()
    {
    }

    public SalesDbContext(DbContextOptions<SalesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Sale> Sales { get; set; }

    public virtual DbSet<Store> Stores { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=tcp:onbordingsqlserver.database.windows.net,1433;Initial Catalog=SalesDB;Persist Security Info=False;User ID=erandi;Password=ChamikaRamawickrama@83;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customer");

            //entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Address)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Product");

            //entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Price).HasColumnType("money");
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            //entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.DateSold).HasColumnType("date");

            //entity.HasOne(d => d.Customer).WithMany(p => p.Sales)
            //    .HasForeignKey(d => d.CustomerId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_Sales_Customer");

            //entity.HasOne(d => d.Product).WithMany(p => p.Sales)
            //     .HasForeignKey(d => d.ProductId)
            //     .OnDelete(DeleteBehavior.ClientSetNull)
            //     .HasConstraintName("FK_Sales_Product");

            //entity.HasOne(d => d.Store).WithMany(p => p.Sales)
            //    .HasForeignKey(d => d.StoreId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_Sales_Store");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.ToTable("Store");

            //entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Address)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(10)
                .IsFixedLength();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
