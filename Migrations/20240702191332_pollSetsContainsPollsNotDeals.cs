using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Multi2Diamonds.Migrations
{
    /// <inheritdoc />
    public partial class pollSetsContainsPollsNotDeals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Polls",
                columns: table => new
                {
                    PollId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PollSetId = table.Column<int>(type: "integer", nullable: false),
                    Dealer = table.Column<int>(type: "integer", nullable: false),
                    Number = table.Column<int>(type: "integer", nullable: false),
                    Vul = table.Column<int>(type: "integer", nullable: false),
                    Cards = table.Column<string>(type: "character varying(17)", maxLength: 17, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Polls", x => x.PollId);
                    table.ForeignKey(
                        name: "FK_Polls_PollSets_PollSetId",
                        column: x => x.PollSetId,
                        principalTable: "PollSets",
                        principalColumn: "PollSetId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Polls_PollSetId",
                table: "Polls",
                column: "PollSetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Polls");

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
    }
}
