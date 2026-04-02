import { Link, NavLink } from "react-router-dom"
import icon from "../assets/meteorito.png" 

export default function Header(){

    return(
        <>
        <div className="bg-neutral-900">
      <nav className="bg-[#0E21A0]/20 shadow-xl text-white">
      <div className="container mx-auto px-4 py-3">
        
        <div className="flex justify-between items-center">
            <Link to="/" className="hover:opacity-80 transition">
            <img className="h-12 w-auto" src={icon} alt="icono" />
            </Link>
          <div className="flex space-x-6">

            <NavLink
            to="/"
            className={({isActive}) =>
            isActive?  'btn-primary hover:text-space-accent transition' : 'btn-primary hover:text-space-accent transition'
            }
            >
            Data    
            </NavLink>
            <NavLink
            to="/radar"
            className={({isActive}) =>
            isActive? 'btn-primary hover:text-space-accent transition' : 'btn-primary hover:text-space-accent transition'
            }
            >
            Radar
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
    </div>
        </>
    )
}