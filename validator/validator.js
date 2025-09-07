/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const Ajv = require('ajv')
const mongoose = require('mongoose')


const AuthValidator = {
  schemas: {
    Adduser: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: {
          type: 'string',
          minLength:  1,
          maxLength:  10
        },
      },
      required: ['password'],
      anyOf: [
        {
          required: ['email']        
        }
      ]
    },
    login: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: {
          type: 'string'
        },
      },
      required: ['password'],
      anyOf: [
        {
          required: ['email']        
        }
      ]
    },
    addaccount: {
      type: 'object',
      properties: {
        account_name: {type: 'string'},
        created_by:{type:"string"},
        updated_by: { type:'string' }
      },
      required: ['account_name'],
    }
  },

  messages: {
    Adduser: {
      'required:anyOf:email': 'email is required',
    },
    addaccount: {
      'required:anyOf:account_name': 'account_name is required',

    }
  }
}

const ajvFormater = async (formatObject) => {
  let errorMessages = []
  try {
    const { errors = [], messages = [] } = formatObject
    if (errors && errors.length > 0) {
      for (const error of errors) {
        let schemaPath = error.keyword
        if (error.schemaPath) {
          const schemaPathArr = error.schemaPath.split('/')
          const schemaPathEle = schemaPathArr[1] || ''
          schemaPath =
            schemaPath == schemaPathEle
              ? schemaPath
              : `${schemaPath}:${schemaPathEle}`
        }
        schemaPath = `${schemaPath}:${error.params.missingProperty}`
        errorMessages.push(messages[schemaPath] || error.message)
      }
    }
  } catch (error) {
    errorMessages = [error.message]
  }
  return errorMessages
}

const ajvCompiler = async (compileObject) => {
  try {
    const { schema = {}, messages = {}, data = {} } = compileObject
    const ajv = new Ajv({})

    ajv.addKeyword({
      keyword: 'ObjectId',
      type: 'string',
      validate: function validate(schema, data) {
        validate.errors = [
          {
            keyword: 'ObjectId',
            message: 'Parameter is not in the type of ObjectId.',
            params: { keyword: 'ObjectId' }
          }
        ]
        return mongoose.isValidObjectId(data)
      },
      errors: true
    })

    ajv.addKeyword({
      keyword: 'isNotEmpty',
      type: 'string',
      validate: function validate(schema, data) {
        validate.errors = [
          {
            keyword: 'isNotEmpty',
            message: 'Parameter is not empty.',
            params: { keyword: 'isNotEmpty' }
          }
        ]
        return typeof data === 'string' && data.trim() !== ''
      },
      errors: true
    })

    const validate = ajv.compile(schema)
    validate(data)
    const formatError = await ajvFormater({
      errors: validate.errors,
      messages: messages
    })
    return formatError || []
  } catch (error) {
    return [error.message]
  }
}

const validateData  = async(data, schemaName = null)=>  {
  const response = {
    status: false,
    message: 'VALIDATION_FAILED',
    data: {}
  }

  try {
    schemaName = schemaName || 'validateData'
    if (!schemaName) throw new Error('SCHEMA_NOT_FOUND')

    const schema = getSchema(schemaName)()
    const messages = (AuthValidator.messages && AuthValidator.messages[schemaName]) || {}
    const validate = await ajvCompiler({ schema, data, messages })

    if (validate && validate.length > 0) {
      throw new Error('VALIDATION_FAILED', { cause: validate })
    }
    response.status = true
    response.message = 'VALIDATION_SUCCESS'
    response.data = {}
  } catch (error) {
    response.status = false
    response.message = error.message || 'VALIDATION_FAILED'
    response.data = {
      validate: error.cause
    }
  }
  return response
}


const getSchema = (schemaName) => {
  return () => {
    if (!AuthValidator.schemas[schemaName]) {
      throw new Error('Schema not found')
    }
    return AuthValidator.schemas[schemaName]
  }
}


module.exports = validateData
