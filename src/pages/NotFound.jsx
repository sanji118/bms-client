
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import astronautImg from "../assets/images/astronaut.png";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl">
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-widest">
            404-<span className="text-yellow-500">error</span>
          </h1>
          <h2 className="text-2xl font-semibold">PAGE NOT FOUND</h2>
          <p className="text-gray-400">
            Your search has ventured beyond the known universe.
          </p>
          <Link to="/">
            <button className="px-5 py-2 border border-yellow-500 hover:bg-yellow-600 transition rounded-full text-white">
              Back To Home
            </button>
          </Link>
        </div>

        
        <motion.div
          initial={{ y: 30 }}
          animate={{  
            y: [0, -20, 0] 
        }}
        >
          <img src={astronautImg} alt="404 Astronaut" className="w-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
