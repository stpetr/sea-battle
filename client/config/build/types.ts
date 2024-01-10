export type BuildMode = 'production' | 'development'

export type BuildPaths = {
  entry: string
  build: string
  html: string
  favicon: string
  src: string
}

export interface BuildOptions {
  mode: BuildMode
  paths: BuildPaths
  isDevMode: boolean
  port: number
}

export type BuildEnv = {
  mode: BuildMode
  port: number
}
