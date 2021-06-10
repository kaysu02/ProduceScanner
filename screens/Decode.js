import React from "react";

import { Container, TextH5 } from "../UI";

export default function DecodeScreen(props){
console.log(props.route.params)
  // const data = props.route.params.data;
  //const data = props.navigation.getParam("data", "NO-QR");
  // const data = props.route.data;
  const data = props.route.params?.data ?? 'NO QR';
  // const data = props.route.params?.data;


  return (
    <Container>
      <TextH5>{data}</TextH5>
      <Route path={"product/:id"} component={DetailsProduct}></Route>
    </Container>
  );
}
DecodeScreen.navigationOptions = {
  title: 'Decode'
};
