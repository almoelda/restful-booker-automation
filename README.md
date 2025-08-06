# Restful Booker Automation

A comprehensive QA automation test suite for the Restful Booker Platform, featuring both API and UI testing capabilities built with Playwright and TypeScript.

## 📋 Overview

This project provides automated testing for the [Restful Booker Platform](https://automationintesting.online), a hotel booking system. The test suite covers critical functionality including room bookings, contact form submissions, branding information retrieval, and administrative operations.

## 🏗️ Project Structure

```
restful-booker-automation/
├── docs/
│   └── Manual Test Cases.pdf
├── tests/
│   ├── api/
│   │   ├── helprs/
│   │   │   └── api-helper.ts
│   │   └── tests/
│   │       ├── branding.spec.ts
│   │       ├── contact.spec.ts
│   │       ├── doubleRoom.spec.ts
│   │       ├── singleRoom.spec.ts
│   │       └── suiteRoom.spec.ts
│   └── ui/
│       ├── pages/
│       │   ├── admin-login.ts
│       │   └── booking-page.ts
│       └── tests/
│           ├── admin-login.spec.ts
│           └── booking.spec.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Features

### API Testing
- **Room Booking Tests**: Comprehensive testing for single, double, and suite room reservations
- **Contact Form Testing**: Validation of contact message submissions
- **Branding API**: Verification of hotel branding information
- **Helper Classes**: Reusable API helper methods for common operations

### UI Testing
- **Booking Flow**: End-to-end testing of the room booking process
- **Navigation Testing**: Validation of all navigation elements and sections
- **Form Validation**: Testing of contact forms and booking forms
- **Page Object Model**: Organized page objects for maintainable UI tests
- **Admin Interface**: Testing of administrative login functionality

## 🛠️ Technology Stack

- **Playwright**: Modern end-to-end testing framework
- **TypeScript**: Type-safe JavaScript for better development experience
- **Page Object Model**: Organized test structure for maintainability
- **ESLint & Prettier**: Code quality and formatting tools
- **Faker.js**: Data generation for test scenarios

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restful-booker-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

## 🧪 Running Tests

### All Tests
```bash
npm run test:all
```

### API Tests Only
```bash
npm run test:api
```

### UI Tests Only
```bash
npm run test:ui
```

### Verbose API Testing
```bash
npm run test:api:verbose
```

### UI Tests with Browser UI
```bash
npm run test:ui:headed
```

### Generate HTML Report
```bash
npm run test:report
```

### Debug Mode
```bash
npm run test:debug
```

## 🔧 Development Commands

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Cleanup
```bash
# Remove test artifacts
npm run clean
```

## 📊 Test Coverage

### API Tests
- **Branding**: Validates hotel branding information retrieval
- **Contact**: Tests contact form submission functionality
- **Room Bookings**: Comprehensive testing for all room types
  - Single Room bookings
  - Double Room bookings
  - Suite Room bookings

### UI Tests
- **Booking Flow**: Complete booking process validation
- **Navigation**: All navigation elements and sections
- **Form Interactions**: Contact and booking form functionality
- **Admin Interface**: Administrative login and operations

## 🏨 Application Under Test

The test suite targets the [Restful Booker Platform](https://automationintesting.online), which includes:

- **Hotel Booking System**: Room selection and reservation
- **Contact Management**: Customer message handling
- **Branding Information**: Hotel details and configuration
- **Administrative Interface**: Backend management capabilities

## 📁 Key Components

### API Helper (`tests/api/helprs/api-helper.ts`)
Centralized API operations including:
- Room booking creation
- Contact message submission
- Branding information retrieval

### Page Objects (`tests/ui/pages/`)
- **BookingPage**: Handles booking form interactions and navigation
- **AdminLoginPage**: Manages administrative login functionality

### Test Configuration (`playwright.config.ts`)
- Chromium browser configuration
- Base URL setup for automationintesting.online
- Screenshot and video capture on failure
- Parallel test execution

## 🎯 Test Scenarios

### Booking Functionality
- Room type selection (Single, Double, Suite)
- Date range selection and validation
- Pricing calculation verification
- Booking confirmation process

### Navigation Testing
- Homepage loading and responsiveness
- Navigation menu functionality
- Section accessibility (Rooms, Amenities, Location, Contact)

### Form Validation
- Contact form submission
- Required field validation
- Data persistence and confirmation

## 📈 Reporting

The test suite generates comprehensive reports:
- **HTML Reports**: Detailed test results with screenshots
- **JSON Reports**: Machine-readable test data
- **Console Output**: Real-time test execution feedback

## 🔍 Debugging

For debugging test failures:
1. Use `npm run test:debug` for interactive debugging
2. Check `test-results/` directory for screenshots and videos
3. Review `playwright-report/` for detailed HTML reports

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Ensure all tests pass before submitting changes
3. Use the provided linting and formatting tools
4. Add appropriate test coverage for new features

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

QA Automation Engineer

---

**Note**: This automation suite is designed for testing the Restful Booker Platform and should be used in accordance with the platform's terms of service.
