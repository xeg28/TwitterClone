using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TwitterClone.Migrations
{
    /// <inheritdoc />
    public partial class postdataadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Biography", "Email", "Followers", "Following", "LegalName", "Username" },
                values: new object[] { 1, "I am currently learning how to build a REST API in ASP.NET.", "eg2895@gmail.com", 2, 0, "Emmanuel Gonzalez", "xeg28" });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "Likes", "MediaPath", "OwnerId", "RepostId", "Reposts", "Text" },
                values: new object[,]
                {
                    { 1, 10, null, 1, null, 2, "This is my first tweet." },
                    { 2, 40, "./media/image.png", 1, null, 10, "This is my second tweet." }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                table: "User",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
