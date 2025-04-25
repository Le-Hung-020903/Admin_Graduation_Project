export interface IModule {
  id: number
  name: string
  desc: string
  created_at?: string
  actions: IAction[]
}
export interface IAction {
  name: string
}
