// @ts-nocheck
import React from 'react'
import { useParams } from '@/lib/router';
import Checkout from '.';

export default function PackageCheckout(props) {
    const params = useParams();

    return (
        <Checkout {...props} order_id={params?.order_id}/>
    )
}
