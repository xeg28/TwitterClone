using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwitterClone.Migrations
{
    /// <inheritdoc />
    public partial class AddReplyCountToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Replies",
                table: "Posts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Replies",
                table: "Posts");
        }
    }
}
