'use client'

import { useState } from 'react'
import { loginStorage } from '../utils'
import { LOGIN_FIELD_LABELS } from '../constants'

interface RememberMeCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  email?: string
}

/**
 * Remember me checkbox component
 * Handles storing user's email preference for future logins
 */
export function RememberMeCheckbox({
  checked: controlledChecked,
  onChange,
  className,
  email
}: RememberMeCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(
    controlledChecked ?? loginStorage.getRememberedEmail() === email
  )

  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked

    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    onChange?.(newChecked)

    // Store/remove email preference
    if (newChecked && email) {
      loginStorage.rememberEmail(email)
    } else if (!newChecked) {
      loginStorage.clearRememberedEmail()
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label
        htmlFor="remember-me"
        className="ml-2 block text-sm text-gray-900"
      >
        {LOGIN_FIELD_LABELS.remember_me}
      </label>
    </div>
  )
}

export type RememberMeCheckboxProps = RememberMeCheckboxProps
