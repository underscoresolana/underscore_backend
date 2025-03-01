# Web3 Material Backend API

This is a FastAPI backend that provides data for the Web3 Material Mockup site.

## Setup and Running

### Backend Setup

1. Install the required dependencies:
```bash
cd us_backend
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The server will be available at http://localhost:8000.

### Frontend Setup

1. Install the frontend dependencies:
```bash
cd web3-material-mockup-site
npm install
```

2. Run the frontend:
```bash
npm run dev
```

# source venv/bin/activate

The frontend will be available at http://localhost:5173.

## API Endpoints

- `GET /` - Welcome message
- `GET /api/tokens` - Get all tokens
- `GET /api/tokens/{token_id}` - Get token by ID
- `GET /api/market-state` - Get market state
- `GET /api/overbought` - Get overbought tokens
- `GET /api/oversold` - Get oversold tokens
- `GET /api/underradar-picks` - Get underradar picks
- `GET /api/ai-report` - Get AI report
- `GET /api/trending-markets` - Get trending markets
- `GET /api/underradar-markets` - Get underradar markets
- `GET /api/chart-data` - Get chart data (optional query param: points)

## Documentation

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 