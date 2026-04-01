// @ts-nocheck
/* eslint-disable */
import React, { useEffect } from 'react'
import packageJson from "../package.json";

export default function PageLoad() {
    useEffect(() => {
        caching();
    }, [])
    const caching = ()=> {
        let version = localStorage.getItem('version');
        if(version !== packageJson.version){
            localStorage.setItem('version', packageJson.version);

            if('caches' in window){
                caches.keys().then((names) => {
                    names.forEach((name) => {
                        caches.delete(name);
                    });
                });
            }
        }
    };
 
  return (
    <div>
      
    </div>
  )
}
