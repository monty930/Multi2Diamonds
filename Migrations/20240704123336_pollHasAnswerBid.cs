using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Multi2Diamonds.Migrations
{
    /// <inheritdoc />
    public partial class pollHasAnswerBid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Answer",
                table: "Polls",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answer",
                table: "Polls");
        }
    }
}
