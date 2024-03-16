using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BridgeScenarios.Migrations
{
    /// <inheritdoc />
    public partial class UserHasSavedContents3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersSavedContent_Users_UserId",
                table: "UsersSavedContent");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UsersSavedContent",
                table: "UsersSavedContent");

            migrationBuilder.RenameTable(
                name: "UsersSavedContent",
                newName: "SavedContents");

            migrationBuilder.RenameColumn(
                name: "dsiString",
                table: "SavedContents",
                newName: "Content");

            migrationBuilder.RenameIndex(
                name: "IX_UsersSavedContent_UserId",
                table: "SavedContents",
                newName: "IX_SavedContents_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "SavedContentType",
                table: "SavedContents",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedContents",
                table: "SavedContents",
                column: "SavedContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavedContents_Users_UserId",
                table: "SavedContents",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavedContents_Users_UserId",
                table: "SavedContents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedContents",
                table: "SavedContents");

            migrationBuilder.RenameTable(
                name: "SavedContents",
                newName: "UsersSavedContent");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "UsersSavedContent",
                newName: "dsiString");

            migrationBuilder.RenameIndex(
                name: "IX_SavedContents_UserId",
                table: "UsersSavedContent",
                newName: "IX_UsersSavedContent_UserId");

            migrationBuilder.AlterColumn<string>(
                name: "SavedContentType",
                table: "UsersSavedContent",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UsersSavedContent",
                table: "UsersSavedContent",
                column: "SavedContentId");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersSavedContent_Users_UserId",
                table: "UsersSavedContent",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
