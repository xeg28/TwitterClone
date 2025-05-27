using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using TwitterClone.Data;
using TwitterClone.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(o =>
{
    o.AddPolicy("CorsPolicy", policy =>
    {
        policy
          // explicitly allow your React dev server
          .WithOrigins("http://localhost:3000")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
    });
});


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TwitterCloneContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<IEmailService, EmailService>();

var app = builder.Build();

app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.Run();
