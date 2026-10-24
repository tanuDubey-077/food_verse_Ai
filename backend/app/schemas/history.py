from typing import List, Optional, Any
from pydantic import BaseModel


class AnalysisSummaryItem(BaseModel):
    id: str
    module_type: str
    title: str
    summary: Optional[str] = None
    confidence: Optional[float] = None
    input_type: str
    file_path: Optional[str] = None
    created_at: str


class HistoryListResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    items: List[AnalysisSummaryItem]


class AnalysisDetailResponse(BaseModel):
    id: str
    module_type: str
    title: str
    summary: Optional[str] = None
    confidence: Optional[float] = None
    input_type: str
    file_path: Optional[str] = None
    results: Any
    metadata: Optional[Any] = None
    created_at: str
