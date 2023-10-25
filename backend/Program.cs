using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<SalesDbContext>(option => option.UseSqlServer("Server=tcp:onbordingsqlserver.database.windows.net;Initial Catalog=SalesDB;Integrated Security=True"));
//builder.Services.AddDbContext<SalesDbContext>(option => option.UseSqlServer("Data Source=DESKTOP-BT36K8P;Initial Catalog=SalesDB;Integrated Security=True"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API Name V1");
    });
}

app.UseHttpsRedirection();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin() // Specify the allowed origin(s)
           .AllowAnyHeader()
           .AllowAnyMethod();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
