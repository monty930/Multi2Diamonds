using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BridgeScenarios.Migrations
{
    /// <inheritdoc />
    public partial class SavedContentExisting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Exists",
                table: "SavedContents",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Exists",
                table: "SavedContents");
        }
    }
}
