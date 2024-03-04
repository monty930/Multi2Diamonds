using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BridgeScenarios.Migrations
{
    /// <inheritdoc />
    public partial class UtcDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DbDealId",
                table: "Deals",
                newName: "DealId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationDate",
                table: "DealSets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreationDate",
                table: "DealSets");

            migrationBuilder.RenameColumn(
                name: "DealId",
                table: "Deals",
                newName: "DbDealId");
        }
    }
}
