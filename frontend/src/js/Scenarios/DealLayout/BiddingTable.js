import Spinner from "../../Common/Spinner";
        
function BiddingTable({ currentDealNo, vul, dealer, loading }) {
    return (
        <div className={"BiddingTable"}>
            <div className={"BiddingTableCell BiddingTableCellN1"}>
            </div>
            <div className={
                "BiddingTableCell " +
                "BiddingTableCellN2 " +
                (vul === 'NS' || vul === "All" ? " Vul" : " NotVul") +
                (dealer === 'North' ? " Dealer" : "")}>
                N
            </div>
            <div className={"BiddingTableCell BiddingTableCellN3"}>

            </div>
            <div className={
                "BiddingTableCell " +
                "BiddingTableCellEW1 " +
                (vul === 'EW' || vul === "All" ? " Vul" : " NotVul") +
                (dealer === 'West' ? " Dealer" : "")}>
                W
            </div>
            <div className={"BiddingTableCell BiddingTableCellEW2"}>
                {loading ? <Spinner/> : currentDealNo}
            </div>
            <div className={
                "BiddingTableCell " +
                "BiddingTableCellEW3 " +
                (vul === 'EW' || vul === "All" ? " Vul" : " NotVul") +
                (dealer === 'East' ? " Dealer" : "")}>
                E
            </div>
            <div className={"BiddingTableCell BiddingTableCellS1"}>
            </div>
            <div className={
                "BiddingTableCell " +
                "BiddingTableCellS2 " +
                (vul === 'NS' || vul === "All" ? " Vul" : " NotVul") +
                (dealer === 'South' ? " Dealer" : "")}>
                S
            </div>
            <div className={"BiddingTableCell BiddingTableCellS3"}>
            </div>
        </div>
    );
}

export default BiddingTable;
