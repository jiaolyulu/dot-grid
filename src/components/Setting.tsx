import { Button, TextField, Drawer } from '@mui/material'
import React, { useState }           from 'react'
import { SizeInterface }             from './page'

const Setting =( { size, setSize }:{size:SizeInterface, setSize:React.Dispatch<React.SetStateAction<SizeInterface>>} )=>{
    const [ open, setOpen ] = useState( false )
    const [ input, setInput ]= useState<{width:string, height:string, margin:string}>( { width:'', height:'', margin:'' } )
    
    const toggleDrawer = ( newOpen: boolean ) => () => {
        setOpen( newOpen )
    }
    
    return(
        <>
            <div className='absolute top-10 left-10'>
                <Button onClick={ toggleDrawer( true ) } variant='outlined'>Open Settings</Button>
                <div className='text-gray-900'>
                    <li>width: {size.width}px</li>
                    <li>height: {size.height}px</li>
                    <li>margin: {size.margin}px</li></div>
            </div>
            
            <Drawer open={ open } onClose={ toggleDrawer( false ) }>
                <div className="p-2 bg-slate-200">
                    {Object.entries( input ).map( ( [ key, value ] )=>(
                        <TextField
                            id="outlined-basic"
                            label={ key }
                            variant="outlined"
                            value={ value } 
                            onChange={ ( e )=>{ 
                                setInput( { ...input, [ key ]: e.target.value } )
                                if ( !Number.isNaN( e.target.value ) ){
                                    setSize( { ...size, [ key ]: parseInt( e.target.value ) } )
                                }
                            } }
                        />

                    ) )}
                    
                    <Button onClick={ ()=>{toggleDrawer( false )} }>Apply</Button>
                </div>

            </Drawer>
            
        </>

    )
}
export default Setting