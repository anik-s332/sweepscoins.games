// @ts-nocheck

const PaginationPage = ({ paginationLength, totalPages, currentPage, onChangePage, userLimit }) => {
    const handlePrevPage = () => {
        if (parseInt(currentPage) > 1) {
        onChangePage(parseInt(currentPage) - 1);
        }
    };

    const handleNextPage = () => {
        if (parseInt(currentPage) < totalPages) {
        onChangePage(parseInt(currentPage) + 1);
        }
    };

    // select page
    let optionarray = [];
    const showNumberList = (count) => {
        if(parseInt(currentPage) <= count) { 
            for (var i = 1; i <= count; i++) { 
                optionarray.push(i);
            };
        }

        const SelectPageNew = (e) => {   
            onChangePage(e.target.value)
        };
        
        return(<select className="form-control" onChange={(e) => SelectPageNew(e)}>
            {optionarray.map((elm, index) => {
                return(<option key={index} selected={elm === currentPage} value={elm}>{elm}</option>)
            })}
        </select>)  
    };

    return (
        <div className="paginationwraps">
            <button className="btn" onClick={handlePrevPage} disabled={parseInt(currentPage) === 1}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevrons-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M11 7l-5 5l5 5"></path>
                    <path d="M17 7l-5 5l5 5"></path>
                </svg>
            </button>
            <span className="cuurentpagedetails"> 
                Page {showNumberList(Math.ceil(totalPages / userLimit))} of <div>{Math.ceil(totalPages / userLimit)}</div> 
            </span>
            <button className="btn" onClick={handleNextPage} disabled={Math.ceil(totalPages / userLimit) === parseInt(currentPage) ? true : false}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevrons-right" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7l5 5l-5 5"></path>
                    <path d="M13 7l5 5l-5 5"></path>
                </svg>
            </button>
        </div>
    );
};

export default PaginationPage;