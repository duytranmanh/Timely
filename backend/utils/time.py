from datetime import datetime, time
from zoneinfo import ZoneInfo
from typing import Optional, Tuple

def get_utc_range_for_local_range(start_str: str, end_str: Optional[str], timezone_str: str) -> Tuple[datetime, datetime]:
    """
    Convert local zone time frame to UTC
    """
    # GET LOCAL ZONE
    tz = ZoneInfo(timezone_str)

    # GET START TIME IN UTC
    start_date = datetime.strptime(start_str, "%Y-%m-%d").date()
    start = datetime.combine(start_date, time.min).replace(tzinfo=tz).astimezone(ZoneInfo("UTC"))

    if end_str:
        # GET END TIME IN UTC
        # END IS EXCLUSIVE
        end_date = datetime.strptime(end_str, "%Y-%m-%d").date()
        end = datetime.combine(end_date, time.min).replace(tzinfo=tz).astimezone(ZoneInfo("UTC"))
    else:
        # IF NO END, USE THE END OF START DATE
        end = datetime.combine(start_date, time.max).replace(tzinfo=tz).astimezone(ZoneInfo("UTC"))

    return start, end

def get_date_from_date_string(date_str: datetime):
    """
    Return date portion of a UTC datetime
    """
    return str(date_str).split()[0]
