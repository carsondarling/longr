
module.exports = {
  roles: {
    id: {type: 'increments', nullable: false, primary: true},
    uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
    name: {type: 'string', maxlength: 150, nullable: false},
    description: {type: 'string', maxlength: 200, nullable: true},
    created_at: {type: 'dateTime',  nullable: false},
    created_by: {type: 'integer',  nullable: false},
    updated_at: {type: 'dateTime',  nullable: true},
    updated_by: {type: 'integer',  nullable: true}
  }
}