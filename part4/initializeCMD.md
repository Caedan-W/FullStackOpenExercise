* navigate to an appropriate directory, and create a new template for our application with the *npm init* command

* install dependencies such as:

  * npm install express
  * npm install --save-dev nodemon
  * npm install cors

* deploy to internet:

  * running the following command in the root directory of the app:
    * fly launch
    * fly deploy
    * fly apps open
    * flyctl ping -o personal

* single-page:

  * build in frontend
  * copy dist dir to backend
  * add "app.use(express.static('dist'))" to backend file

* proxy:

  * in development mode the frontend is at the address *localhost:5173*, the requests to the backend go to the wrong address *localhost:5173/api/notes*. The backend is at *localhost:3001*.

  * If the project was created with Vite, this problem is easy to solve. It is enough to add the following declaration to the *vite.config.js* file of the frontend repository.

    * ```bash
      import { defineConfig } from 'vite'
      import react from '@vitejs/plugin-react'
      
      // https://vitejs.dev/config/
      export default defineConfig({
        plugins: [react()],
        server: {    
        	proxy: {      
        		'/api': {        
        			target: 'http://localhost:3001',        
        			changeOrigin: true,      
        			},    
        		  }  
        		},
        	})
      ```

* env

  * `npm install dotenv`
  * `save MONGODB_URL,PORT to .env file`
  * add .env to .gitignore and .dockerignore

* eslint

  * npm install eslint@8.5.0 --save-dev
  * npm install eslint-plugin-react