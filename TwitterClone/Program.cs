using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
          .AllowCredentials()
          .AllowAnyHeader();
    });
});


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<TwitterCloneContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddHostedService<EmailVerificationCleanupService>();
builder.Services.AddHostedService<PasswordResetCleanupService>();
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
       ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
       ValidAudience = builder.Configuration["JwtConfig:Audience"],
       IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"]!)),
       ValidateIssuer = true,
       ValidateAudience = true,
       ValidateLifetime = true,
       ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

var app = builder.Build();

app.UseCors("CorsPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
