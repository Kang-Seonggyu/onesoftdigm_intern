import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    yearDecrease,
    yearIncrease,
    monthIncrease,
    monthDecrease,
    changeTitle,
    changeCategory,
    setNull, changeStartDate, changeEndDate
} from "../../Components/modules/momenter";
import Calendar from "../../Components/Calendar/Calendar";
import AddNewEvent from "../../Components/Calendar/AddNewEvent";
import {getHoliday} from "../../Components/modules/momenter";
import moment from "moment";

function CalendarContainer(props) {

    ////////////// Redux 구간 /////////////////////////////////////////////////

    const { momentValue, holiday, loadingHoliday, newEventData} = useSelector(state => ({
        momentValue: state.momenter.momentValue,
        holiday: state.momenter.holiday,
        loadingHoliday: state.momenter.loading.GET_HOLIDAY,
        newInput : state.momenter.newInput,
        newEventData : state.momenter.newEventInfo
    }));

    const dispatch = useDispatch();

    const yearIncreaseButton = () => dispatch(yearIncrease());
    const yearDecreaseButton = () => dispatch(yearDecrease());
    const monthIncreaseButton = () => dispatch(monthIncrease());
    const monthDecreaseButton = () => dispatch(monthDecrease());

    const changeE_title = e => dispatch(changeTitle(e.target.value));
    const changeE_category = e => {
        dispatch(changeStartDate(moment().format('YYYY-MM-DD')))
        dispatch(changeEndDate(moment().format('YYYY-MM-DD')))
        dispatch(changeCategory(e.target.value));
    }
    const changeE_startDate = e => dispatch(changeStartDate(e.target.value));
    const changeE_endDate = e => dispatch(changeEndDate(e.target.value));
    const makeE_setNull = () => dispatch(setNull())

    useEffect(() => {
        dispatch(getHoliday(momentValue));
    }, [momentValue]);

    ////////////////////////////////////////////////////////////////////////////

    // 일정추가 창 보여주것을 정하는 State
    const [NewEvent, setNewEvent] = useState(false);

    let noDataCheck;
    if (newEventData.title !=='' && newEventData.category !=='')
    {noDataCheck = false}
    else { noDataCheck = true }

    const AddEventClick = () => {
        setNewEvent(true);
    };
    const CancelClick = () => {
        setNewEvent(false);
        makeE_setNull()
    };
    const ConfirmClick = (e) => {
        if(newEventData.title === ''){
            e.preventDefault() //제출완료 페이지로 넘어가는 것 방지
            alert('제목을 입력하세요')
        }
        else if(newEventData.startDate === ''){
            e.preventDefault()
            alert('날짜를 입력하세요')
        }
        else {
            setNewEvent(false);
            makeE_setNull()
            //console.log(startDay) 형식 : 2022-10-17 과 같이 나타남
        }
    };

    const onReload = () => {
        window.location.reload();
    }

    return (
        <div>
            <Calendar
                AddEventClick={AddEventClick}   // 일정추가 클릭
                onReload={onReload}             // 새로고침
                momentValue={momentValue}       // 현재 보고있는 모멘트 값
                yearIncreaseButton={yearIncreaseButton}
                yearDecreaseButton={yearDecreaseButton}
                monthIncreaseButton={monthIncreaseButton}
                monthDecreaseButton={monthDecreaseButton}
                loadingHoliday={loadingHoliday} // 공휴일 정보 로딩 확인
                Holidays={holiday}              // 공휴일 정보
                newEventData={newEventData}
                changeE_title={changeE_title}
                changeE_category={changeE_category}
            />
            <AddNewEvent
                visible={NewEvent}
                onCancel={CancelClick}
                onConfirm={ConfirmClick}
                newEventData={newEventData}
                noDataCheck={noDataCheck}
                changeE_title={changeE_title}
                changeE_category={changeE_category}
                changeE_startDate={changeE_startDate}
                changeE_endDate={changeE_endDate}
            />
        </div>
    );
}

export default CalendarContainer;