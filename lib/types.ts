export type PaymentMethod = 'M-Pesa' | 'Bank transfer' | 'Western Union' | 'Other'
export type PledgeStatus = 'pledged' | 'paid'

export interface Pledge {
  id: string
  created_at: string
  full_name: string
  nickname: string | null
  phone: string
  location: string
  amount: number
  payment_method: PaymentMethod
  message: string | null
  status: PledgeStatus
  approved: boolean
}

export interface PledgeFormData {
  full_name: string
  nickname: string
  phone: string
  location: string
  amount: number | ''
  payment_method: PaymentMethod
  message: string
}
