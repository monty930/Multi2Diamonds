using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Multi2Diamonds.Migrations
{
    /// <inheritdoc />
    public partial class pollSetsWithBiddingInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PollSets",
                columns: table => new
                {
                    PollSetId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DealSetId = table.Column<int>(type: "integer", nullable: false),
                    Bidding_Bids = table.Column<int[]>(type: "integer[]", nullable: false),
                    Bidding_Dealer = table.Column<int>(type: "integer", nullable: false),
                    KeyBinds = table.Column<string>(type: "text", nullable: false),
                    OutputRaw = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PollSets", x => x.PollSetId);
                    table.ForeignKey(
                        name: "FK_PollSets_DealSets_DealSetId",
                        column: x => x.DealSetId,
                        principalTable: "DealSets",
                        principalColumn: "DealSetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PollSets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PollSets_DealSetId",
                table: "PollSets",
                column: "DealSetId");

            migrationBuilder.CreateIndex(
                name: "IX_PollSets_UserId",
                table: "PollSets",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PollSets");
        }
    }
}
