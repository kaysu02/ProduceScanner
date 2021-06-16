import React from 'react';

import { Container, TextH5 } from '../UI';

export default function ConfirmScreen(props) {
    console.log(props.route.params);

    React.useEffect(() => {
        console.log('Confirm component mounted');
    }, []);
    //  console.log(props.route.params.data)
    //  console.log(Object.keys(props.route.params))
    // const data = props.route.params.data;
    // const data = props.route.data;

    //  const data = props.route.params.data ?? 'NO QR';
    // const data = Object.keys(props.route.params).map(i => {
    //   return({i.map(j => {
    //     return (
    //       <h1>j</h1>)r
    //   }
    //    )})
    // })
    const data = Object.keys(props.route.params).map((data) => data.concat());

    //  const data = props.route.params
    // const data = props.route.params?.data;

    return (
        <Container>
            <TextH5>{data}</TextH5>
            {/* {
          for (var i = 0; i < data.length; i++) {
            data.push(

            )
          }
      } */}
        </Container>
    );
}
ConfirmScreen.navigationOptions = {
    title: 'Confirm',
};
