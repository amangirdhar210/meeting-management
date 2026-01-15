# API Error Handling Guide

## Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "error_code": 1000,
  "message": "Human-readable error message",
  "details": "Additional context (optional)"
}
```

## Error Response Fields

| Field        | Type         | Description                                         |
| ------------ | ------------ | --------------------------------------------------- |
| `error_code` | integer      | Unique numeric code identifying the error type      |
| `message`    | string       | Short, user-friendly error message                  |
| `details`    | string/array | Additional context or validation details (optional) |

## HTTP Status Codes

| Status Code | Description           | When Used                                                         |
| ----------- | --------------------- | ----------------------------------------------------------------- |
| `400`       | Bad Request           | Invalid business logic (e.g., room unavailable, booking conflict) |
| `401`       | Unauthorized          | Missing or invalid authentication token                           |
| `403`       | Forbidden             | User doesn't have permission for the action                       |
| `404`       | Not Found             | Resource doesn't exist                                            |
| `409`       | Conflict              | Resource already exists (e.g., duplicate email)                   |
| `422`       | Unprocessable Entity  | Invalid input format/validation error                             |
| `500`       | Internal Server Error | Unexpected server error                                           |

## Error Code Ranges

| Range       | Category              | Examples                                 |
| ----------- | --------------------- | ---------------------------------------- |
| `1000-1999` | User Errors           | User not found, email already exists     |
| `2000-2999` | Room Errors           | Room not found, room unavailable         |
| `3000-3999` | Booking Errors        | Booking not found, invalid time range    |
| `4000-4999` | Authentication Errors | Invalid credentials, unauthorized access |
| `4220`      | Validation Errors     | Invalid input format                     |
| `9000-9999` | System Errors         | Internal server error                    |

## Common Error Codes

### User Errors (1000-1999)

- `1001` - User not found
- `1002` - User with this email already exists
- `1003` - Invalid user data

### Room Errors (2000-2999)

- `2001` - Room not found
- `2002` - Room already exists
- `2003` - Room unavailable
- `2004` - Invalid room data

### Booking Errors (3000-3999)

- `3001` - Booking not found
- `3002` - Room unavailable for the requested time
- `3003` - Invalid time range
- `3004` - Booking too far in advance

### Authentication Errors (4000-4999)

- `4001` - Invalid credentials
- `4002` - Unauthorized access
- `4003` - Admin access required
- `4220` - Validation error (invalid input format)

### System Errors (9000-9999)

- `9001` - Internal server error

## Example Error Responses

### 1. Resource Not Found (404)

```json
{
  "error_code": 1001,
  "message": "User not found"
}
```

### 2. Validation Error (422)

```json
{
  "error_code": 4220,
  "message": "Invalid input",
  "details": "Invalid field: date"
}
```

Multiple validation errors:

```json
{
  "error_code": 4220,
  "message": "Invalid input",
  "details": "Invalid fields: email, password"
}
```

### 3. Business Logic Error (400)

```json
{
  "error_code": 3002,
  "message": "Room is not available for the selected time slot"
}
```

### 4. Conflict Error (409)

```json
{
  "error_code": 1002,
  "message": "User with this email already exists"
}
```

### 5. Unauthorized (401)

```json
{
  "error_code": 4002,
  "message": "Unauthorized access"
}
```

### 6. Internal Server Error (500)

```json
{
  "error_code": 9001,
  "message": "Internal server error"
}
```

## Frontend Implementation Guidelines

### 1. Always Check HTTP Status Code First

```javascript
if (!response.ok) {
  const error = await response.json();
  // Handle error based on status code and error_code
}
```

### 2. Generic Error Handler Example

```javascript
async function handleApiError(response) {
  const error = await response.json();

  switch (response.status) {
    case 400:
      // Business logic error
      showError(error.message);
      break;
    case 401:
      // Redirect to login
      redirectToLogin();
      break;
    case 403:
      showError("You don't have permission for this action");
      break;
    case 404:
      showError(error.message || "Resource not found");
      break;
    case 409:
      // Show conflict message
      showError(error.message);
      break;
    case 422:
      // Validation error - highlight invalid fields
      showValidationError(error.details);
      break;
    case 500:
      showError("Something went wrong. Please try again later.");
      break;
    default:
      showError(error.message || "An error occurred");
  }
}
```

### 3. Handling Validation Errors (422)

```javascript
function showValidationError(details) {
  if (typeof details === "string") {
    // Single field error: "Invalid field: email"
    const field = details.replace("Invalid field: ", "");
    highlightField(field);
  } else {
    // Multiple fields: "Invalid fields: email, password"
    const fields = details.replace("Invalid fields: ", "").split(", ");
    fields.forEach((field) => highlightField(field));
  }
}
```

### 4. Using Error Codes for Specific Handling

```javascript
const error = await response.json();

switch (error.error_code) {
  case 1002:
    // Email already exists - focus on email field
    showFieldError("email", "This email is already registered");
    break;
  case 3002:
    // Room unavailable - show available times
    showAvailableTimeSlots();
    break;
  case 4001:
    // Invalid credentials
    showError("Invalid email or password");
    break;
  default:
    showError(error.message);
}
```

## Best Practices

1. **Always display `error.message`** - It's designed to be user-friendly
2. **Use `error_code`** for programmatic handling and specific UI flows
3. **Use `details`** for additional context when available
4. **Log full error object** to console for debugging
5. **Don't expose `error_code` to end users** - Use it internally for logic
6. **Handle 401 errors globally** - Redirect to login page
7. **Show generic message for 500 errors** - Don't expose internal details

## Testing Error Handling

Test your error handling with these scenarios:

1. **Validation Errors**: Send invalid data formats
2. **Unauthorized**: Make requests without token
3. **Not Found**: Request non-existent resources
4. **Conflict**: Try to create duplicate resources
5. **Business Logic**: Attempt invalid operations (e.g., book unavailable room)

## Questions?

Contact the backend team for any clarification on error codes or response formats.
