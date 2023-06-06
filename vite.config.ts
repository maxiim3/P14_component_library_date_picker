import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
								plugins: [react()],
								build: {
									outDir: 'dist',
									lib: {
										entry: path.resolve(__dirname, 'src/index.tsx'),
										name: 'MyLibrary'
									},
									rollupOptions: {
										output: {
											entryFileNames: '[name].js' // add this line
										}
									}
								}
							})
