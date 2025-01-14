import moment from 'moment';
import palette from "../../library/styles/palette";
import styled from "styled-components";
import React, {useEffect, useState} from "react";

const CalTotalBlock = styled.div`
  width: 100%;
  min-width: 650px;
  height: 90%;
  margin: 1px;
  display: grid;
  align-items: center;
  justify-items: center;
`

const CalendarBlock = styled.div`
  width: 95vw;
  min-width: 640px;
  height: 72vh;
  min-height: 600px;
`
const CalendarIndex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  height: 30px;
  .birthday {
    background: ${palette.birth};
  }
  .holiday {
    background: ${palette.holi};
  }
  .vacation {
    background: ${palette.vaca};
  }
  .Event {
    background: ${palette.Event};
  }
  .others {
    background: ${palette.others};
  }
`
const IndexingBar = styled.div`
  margin: 7px;
  width: 5vw;
  max-width: 50px ;
  height: 3vh;
  min-height: 15px;
  max-height: 25px;
  font-size: 2vh;
`;
const CalendarControllerBlock = styled.div`
  display: grid;
  grid-template-columns: 50px 30px 1fr 30px 50px;
  width: 95vw;
  min-width: 640px;
  height: 60px;
  margin-top : 10px;
  align-items: center;
  justify-items: center;
`
const Spacer = styled.div`
`
const ControlButton = styled.button`
  border: none;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
`
const CalendarBox = styled.div`
  margin: 2px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1px;
  text-align: center;
  .today {
    background: #c8ffc8;
  }
`
const TableHead = styled.div`
  background: lightgreen;
`
const TableBody = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  grid-auto-rows: minmax(10rem, auto);
  min-width: 30px;
  max-width: 100%;
  height: auto;
  min-height: 90px;
  padding-left : 4px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;

  .date {
    padding-left: 5px;
  }

  .sunday {
    color: red;
  }
  .anotherMonth {
    color: lightgray !important;
  }
  .holiday {
    color: red;
    background: ${palette.holi};
    border-radius: 7px;
  }
  .birthday {
    background: ${palette.birth};
    width: 90%;
    border-radius: 7px;
  }
  .vacation {
    background: ${palette.vaca};
    width: 90%;
    border-radius: 7px;
  }
  .Event {
    background: ${palette.Event};
    width: 90%;
    border-radius: 7px;
  }
  .others {
    background: ${palette.others};
    width: 90%;
    border-radius: 7px;
  }
`
const EventDiv = styled.div`
  padding-left: 3px;
  cursor: pointer;
  :hover{
    filter: brightness(85%);
  }
`

function Calendar ({
                       AddEventClick,
                       onReload,
                       momentValue,
                       monthDecreaseButton,
                       monthIncreaseButton,
                       yearDecreaseButton,
                       yearIncreaseButton,
                       loadingHoliday,
                       Holidays,
                       loadingEvents,
                       newVacationList,
                       loadingVacation,
                       newEventList,
                       onEventClick,
                       onVacationClick,
                   }) {


    // 이번달의 첫번째 주
    const firstWeek = momentValue.clone().startOf('month').week();
    // 이번달의 마지막 주 (만약 마지막 주가 1이 나온다면 53번째 주로 변경)
    const lastWeek = momentValue.clone().endOf('month').week() === 1? 53 : momentValue.clone().endOf('month').week();

    const calendarArr=()=> {
        // 공휴일 데이터 가져오기. (객체형태로)
        // 예시 : { '2022-10-03' : '개천절' }
        let holidaylist = {};
        if(!loadingHoliday && Holidays){
            Holidays.forEach((holiday) => {

                let holiday_year = holiday.locdate.toString().substring(0,4);
                let holiday_month = holiday.locdate.toString().substring(4,6).padStart(2,0);
                let holiday_day = holiday.locdate.toString().substring(6,8).padStart(2,0);

                let holiday_ID = `Date-${holiday_year}-${holiday_month}-${holiday_day}`;
                holidaylist[holiday_ID] = holiday.dateName;
            })
        }

        // 달력 만드는 구간
        let result = [];
        let week = firstWeek;

        for (week; week <= lastWeek; week++) {
            // day = [ 일,월,화,수,목,금,토 ]
            for (let day = 0; day < 7; day++) {
                let currentMoment = momentValue.clone().startOf('year').week(week).startOf('week').add(day, 'day'); // 'D' 로해도되지만 직관성
                let date = currentMoment.format('YYYY-MM-DD')
                let dateID = `Date-${date}`

                // 해당 날짜에 class 값 넣기위한 조건처리.
                let todayCheck = currentMoment.format('YYYYMMDD') === moment().format('YYYYMMDD')  ? 'Today' : 'week';
                let dayCheck = day === 0 ? 'sunday' : todayCheck;

                // 이번달인 경우
                if (currentMoment.format('MM') === momentValue.format('MM')) {
                    if (dateID in holidaylist) {
                        result.push(PushTag(currentMoment, dateID, dayCheck, holidaylist[dateID]));
                    } else {
                        result.push(PushTag(currentMoment, dateID, dayCheck, ''));
                    }
                    // 이번달이 아닌 경우
                } else {
                    result.push(PushTag(currentMoment, dateID,"anotherMonth",''));
                }
            }
        }
        return result;
    }

    // currentMoment  : 해당 날짜의 모멘트값
    // dateID         : 참조하기 위한 ID 값
    // dayClass       : 해당 날짜의 분류 ( Today, week, sunday, anotherMonth )
    // Holiday        : 공휴일 정보
    const PushTag = (currentMoment, dateID, dayClass, HolidayTitle) => {
        const today = currentMoment.format('YYYYMMDD') === moment().format('YYYYMMDD');

        return (
            <TableBody id={dateID} key={currentMoment.format('MM-DD')} className={`${today ? 'today' : ''}`}>
                <span>
                    <span className={HolidayTitle === ''? `date ${dayClass}`: `date sunday`}>
                        {currentMoment.format('D')}
                    </span>
                    <span className="holiday">
                        {HolidayTitle}
                    </span>
                </span>
                {!loadingVacation && dayClass !=="anotherMonth" ?
                    <EventDiv
                        onClick={onVacationClick}
                        id={currentMoment.format('YYYY-MM-DD')}
                        className="vacation" title="자세히보기"
                    >
                        {oneDayData(currentMoment.format('YYYY-MM-DD'))}
                    </EventDiv>
                    :
                    ''
                }
                {!loadingEvents && dayClass!=="anotherMonth" ?
                    PostEventsList(currentMoment.format('YYYY-MM-DD') ,newEventList).map((foundEvent) => {
                        return (
                            <EventDiv
                                key={foundEvent.inputKey}
                                title="이벤트 수정하기"
                                id={foundEvent.inputKey}
                                onClick={onEventClick}
                                className={foundEvent.category}
                            >
                                {foundEvent.title}
                            </EventDiv>
                        )})
                    :
                    '' // 다른 달의 경우 이벤트 나타내지 않음.
                }
            </TableBody>
        )
    }

    const PostEventsList = ( eventDate, newEventList ) => {
        let foundEvents =  newEventList.filter(e => e.date === eventDate);
        return foundEvents;
    }

    const oneDayData = (eventDate) => {
        if(!loadingVacation && newVacationList){
            const oneDayFilter = newVacationList.filter(e => e.date === eventDate)
            if(oneDayFilter.length > 1 ) {
                return `${oneDayFilter[0].title}외 ${oneDayFilter.length-1}명`
            }
            else if (oneDayFilter.length === 1) {
                return oneDayFilter[0].title
            }
            else { return ''}
        }
    }


    return(
        <div>
            <CalTotalBlock>
                <CalendarControllerBlock>
                    <button title="새로고침" onClick={onReload}><i className="fas fa-redo fa-fw me-1" /></button>
                    <Spacer style={{gridColumn:"2/4",gridRow : "1"}}></Spacer>
                    <button style={{gridColumn:"4/6",gridRow : "1"}} onClick={AddEventClick}>일정추가</button>
                    <ControlButton title="1년전" onClick={yearDecreaseButton}>«</ControlButton>
                    <ControlButton title="1달전" onClick={monthDecreaseButton}>‹</ControlButton>
                    <span style={{gridColumn:"3", fontSize:"25px"}}>{momentValue.format('YYYY 년 MM 월')}</span>
                    <ControlButton title="1달후"  onClick={monthIncreaseButton}>›</ControlButton>
                    <ControlButton title="1년후"  onClick={yearIncreaseButton}>»</ControlButton>
                </CalendarControllerBlock>
                <CalendarBlock>
                    <CalendarIndex>
                        <IndexingBar title="birthday" className="birthday"/>생일
                        <IndexingBar title="holiday" className="holiday"/>공휴일
                        <IndexingBar title="event" className="Event"/>행사
                        <IndexingBar title="vacation" className="vacation"/>휴가
                        <IndexingBar title="others" className="others"/>기타
                    </CalendarIndex>
                    <CalendarBox>
                        { ['일','월','화','수','목','금','토'].map((day) => {
                            return( <TableHead key={day} title={`${day}요일`} className="tableHead">{day}</TableHead> )
                        })}
                        {calendarArr()}
                    </CalendarBox>
                </CalendarBlock>
            </CalTotalBlock>
        </div>
    )
}

export default Calendar;