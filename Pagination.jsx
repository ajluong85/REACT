import React from "react";

import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";

function Pagination() {
   state = {
      current: 3,
   };

   onChange = (page) => {
      console.log(page);
      this.setState({
         current: page,
      });
   };

   return (
      <Pagination
         onChange={this.onChange}
         current={this.state.current}
         total={25}
         locale={locale}
      />
   );
}

export default Pagination;
