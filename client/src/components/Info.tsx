import { Flex,Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { ProgressPage } from "./ProgressPage";
import moment from "moment";
interface IProp{
    id: number
}
const Info:React.FC<IProp> = ({id }) => {
    const[{data: info, fetching: loading}] = useMeQuery();
    if(loading){
        return <ProgressPage/>
    }
    return <div>
        {
            info?.me?.id === id
            ?
            <Flex flexDirection="column" justifyContent="center" alignItems="center"
             paddingTop="100px"
             lineHeight="10"
            >
                <Text
                fontSize="130%"
                fontWeight="bold"
                >
                    Username:
                    &nbsp; 
                    <span style={{fontWeight: 400}}>
                        {
                            info?.me?.username
                        }
                    </span>
                </Text>
                <Text
                fontSize="130%"
                fontWeight="bold"
                >
                    Email:
                    &nbsp; 
                    <span style={{fontWeight: 400}}>
                        {
                            info?.me?.email
                        }
                    </span>
                </Text>
                <Text
                fontSize="130%"
                fontWeight="bold"
                >
                    Joined:
                    &nbsp; 
                    <span style={{fontWeight: 400}}>
                        {
                            moment(Number(info?.me?.createdAt)).fromNow()
                        }
                    </span>
                </Text>
            </Flex>
            :
            "You are not authenticated to redirect to this page :("
        }
    </div>
}
export default withUrqlClient(createUrqlClient)(Info);