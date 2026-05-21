using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwitterClone.Migrations
{
    /// <inheritdoc />
    public partial class PostsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "Posts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RootId",
                table: "Posts",
                type: "integer",
                nullable: true);

            // Create a plpgsql function that sets RootId to Id when RootId is null (BEFORE INSERT).
            migrationBuilder.Sql(@"
            CREATE OR REPLACE FUNCTION set_posts_rootid()
            RETURNS trigger AS $$
            BEGIN
                IF NEW.""RootId"" IS NULL THEN
                    NEW.""RootId"" := NEW.""Id"";
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            ");

            // Attach the trigger to Posts (before insert)
            migrationBuilder.Sql(@"
            DROP TRIGGER IF EXISTS trg_set_posts_rootid ON ""Posts"";
            CREATE TRIGGER trg_set_posts_rootid
            BEFORE INSERT ON ""Posts""
            FOR EACH ROW
            EXECUTE FUNCTION set_posts_rootid();
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove trigger and function
            migrationBuilder.Sql(@"
            DROP TRIGGER IF EXISTS trg_set_posts_rootid ON ""Posts"";
            DROP FUNCTION IF EXISTS set_posts_rootid();
            ");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "RootId",
                table: "Posts");
        }
    }
}
