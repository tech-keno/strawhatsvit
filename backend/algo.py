import pandas as pd

df1 = pd.read_csv("uploads/Sample enrolment data.csv")
df2 = pd.read_excel("uploads/otherstuff.xlsx")

def algo():

    name_classes = {}
    student_names = df1["Student Name"].to_list()
    classes = df2["Unit"].to_list()
    times = df2["Time"].to_list()
    student_names = df1["Student Name"].to_list()
    lecturer = df2["Lecturer"].to_list()
    classroom = df2["Classroom"].to_list()
    delivery_m = df2["Delivery Mode"].to_list()


    clas_dict = {}



    for clas in range(len(classes)):
        c = classes[clas]
        if c not in clas_dict:
            clas_dict[c] = {}
            clas_dict[c]["students"] = set()
            clas_dict[c]["length"] = -1
            clas_dict[c]["delivery_mode"] = ""
            clas_dict[c]["classroom"] = ""
            clas_dict[c]["lecturer"] = ""
            
        for student_enrol in range(len(df1[c])):  
            if df1[c][student_enrol] == "ENRL":
                clas_dict[c]["length"] = times[clas]
                clas_dict[c]["students"].add(student_names[student_enrol])
                clas_dict[c]["delivery_mode"] = delivery_m[clas]
                clas_dict[c]["classroom"] = classroom[clas]
                clas_dict[c]["lecturer"] = lecturer[clas]
                    



    timetable_dict = {}

    for i in range(0,60):
        timetable_dict[i] = (set(), set())
        
    removed_classes = set()
        


    for i in range(0, 60):
        for clas in clas_dict:   
            if clas_dict[clas]["length"] > 0 and clas not in removed_classes:
                can_schedule = True
                for period in range(clas_dict[clas]["length"]):
                    temp_set = clas_dict[clas]["students"] - timetable_dict[i + period][1]
                    if len(temp_set) != len(clas_dict[clas]["students"]):
                        can_schedule = False
                        break              
                    if can_schedule:
                        for insert in range(clas_dict[clas]["length"]):
                            timetable_dict[i + insert][1].update(clas_dict[clas]["students"])
                            timetable_dict[i + insert][0].add(clas)
                        removed_classes.add(clas)




    times = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']


    f_classes = []
    f_times = []
    classroom = []
    f_days = []
    lecturer = []
    delivery_mode = []





    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']


    def convert_index_to_time(index):
        day = days[index // 12]
        hour = 8 + (index % 12) 
        if hour < 12:
            time = f'{hour}:00 AM'
        elif hour == 12:
            time = '12:00 PM'
        else:
            time = f'{hour - 12}:00 PM'
        return day, time, hour

    def convert_num_time(time):
        
        if time > 12:
            ret = f'{time - 12}:00 PM'
        elif time < 12:
            ret = f'{time}:00 AM'
        else:
            ret = "12:00 PM"
        return ret

    rows = []
    used_classes = set()

    start_time = None

    for time_index in range(60):
        day, start_time, hour = convert_index_to_time(time_index)
        for clas in timetable_dict[time_index][0]:
            if clas not in used_classes:
                rows.append({
                    'Day': day,
                    'Time': f'{start_time} to {convert_num_time(hour + clas_dict[clas]["length"])}',
                    'Unit': (clas),
                    'Classroom': clas_dict[clas]["classroom"],
                    'Lecturer': clas_dict[clas]["lecturer"],
                    'Delivery Mode': clas_dict[clas]["delivery_mode"]
                })
                used_classes.add(clas)
                
            
        
    to_convert = pd.DataFrame(rows)

    excel_file = "output/magic.xlsx"
    to_convert.to_excel(excel_file, index=False)
            