import React from "react";

import { Container, TextH5 } from "../UI";

export default function ConfirmationScreen(props){
   console.log(props.route.params)
   console.log(props.route.params.data)
   console.log(Object.keys(props.route.params))
  // const data = props.route.params.data;
  // const data = props.route.data;

   const data = props.route.params.data ?? 'NO QR';
  // const data = Object.keys(props.route.params).map(i => {
  //   return({i.map(j => {
  //     return (
  //       <h1>j</h1>)
  //   }
  //    )})
  // })


  //  const data = props.route.params
  // const data = props.route.params?.data;


  return (
    <Container>
      <TextH5>{data}</TextH5>
      {/* <React.fragment>data</React.fragment> */}

    </Container>
  );
}
ConfirmationScreen.navigationOptions = {
  title: 'Confirmation'
};
