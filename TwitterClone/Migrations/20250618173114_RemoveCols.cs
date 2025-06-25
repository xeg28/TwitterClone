using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TwitterClone.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCols : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Biography", "DateJoined", "Email", "Followers", "Following", "HashedPassword", "IsVerified", "LegalName", "Username" },
                values: new object[] { 1, "I am currently learning how to build a REST API in ASP.NET.", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "eg2895@gmail.com", 2, 0, null, false, "Emmanuel Gonzalez", "xeg28" });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "DatePosted", "Likes", "MediaPath", "OwnerId", "RepostId", "Reposts", "Text" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10, null, 1, null, 2, "This is my first tweet." },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 40, "./media/image.png", 1, null, 10, "This is my second tweet." }
                });
        }
    }
}
