using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Multi2Diamonds.Migrations
{
    /// <inheritdoc />
    public partial class pollSetsContainsDealsNotDealSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PollSets_DealSets_DealSetId",
                table: "PollSets");

            migrationBuilder.DropIndex(
                name: "IX_PollSets_DealSetId",
                table: "PollSets");

            migrationBuilder.DropColumn(
                name: "DealSetId",
                table: "PollSets");

            migrationBuilder.AddColumn<int>(
                name: "PollSetId",
                table: "Deals",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Deals_PollSetId",
                table: "Deals",
                column: "PollSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Deals_PollSets_PollSetId",
                table: "Deals",
                column: "PollSetId",
                principalTable: "PollSets",
                principalColumn: "PollSetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Deals_PollSets_PollSetId",
                table: "Deals");

            migrationBuilder.DropIndex(
                name: "IX_Deals_PollSetId",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "PollSetId",
                table: "Deals");

            migrationBuilder.AddColumn<int>(
                name: "DealSetId",
                table: "PollSets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PollSets_DealSetId",
                table: "PollSets",
                column: "DealSetId");

            migrationBuilder.AddForeignKey(
                name: "FK_PollSets_DealSets_DealSetId",
                table: "PollSets",
                column: "DealSetId",
                principalTable: "DealSets",
                principalColumn: "DealSetId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
