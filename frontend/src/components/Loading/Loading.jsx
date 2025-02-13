import React from 'react'
import './Loading.css'
import { Center } from '@chakra-ui/react'
import logo from '../../images/logo.png'
const Loading = () => {
    return (
        <Center minH="80vh">
            <div className="logo-container">
                <img src={logo} alt="Loading..." className="logo" />
            </div>
        </Center>
    );
}

export default Loading