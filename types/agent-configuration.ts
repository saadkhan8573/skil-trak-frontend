import { BaseResponse } from './base.type'

export interface AgentConfigurationTypes extends BaseResponse {
    id: number
    isActive: boolean
    name: string
    responsibility: string
    vapiAgentId: string
}
