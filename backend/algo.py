import pandas as pd
import os 

# df1: given data from the client
# df2: input take from the website
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths for the files
df1_path = os.path.join(current_dir, "uploads/Sample enrolment data.csv")
df2_path = os.path.join(current_dir, "uploads/otherstuff.xlsx")

# Load the data
def main():
    df1 = pd.read_csv(df1_path)
    df2 = pd.read_excel(df2_path)
    rows = algo(df1, df2)
    to_convert = pd.DataFrame(rows)

    excel_file = "output/magic4.xlsx"
    to_convert.to_excel(excel_file, index=False)



"""
Create JSON Representation of a class eg. {MITS101: {length : -1, Lecturer: Jake...}, MITS102: }
""" 
def make_classes(df1, df2):
    name_classes = {}
    student_names = df1["Student Name"].to_list()
    classes = df2["Unit"].to_list()
    times = df2["Time"].to_list()
    student_names = df1["Student Name"].to_list()
    lecturer = df2["Lecturer"].to_list()
    classroom = df2["Classroom"].to_list()
    delivery_m = df2["Delivery Mode"].to_list()
    clas_dict = {}

    # Classes that don't have a length are just left blank
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
    return clas_dict

"""
Main Algorithm, performs the allocation process of students to specific time periods
"""

def algo(df1, df2):
    
    removed_classes = set()
    timetable_dict = {}

    # Allocate a slot per hour 12 * 5 = 60, 12 hours a day, five days a week
    for i in range(0,60):
        timetable_dict[i] = (set(), set())  

    clas_dict = make_classes(df1, df2)

    # Basic Algorithm: For each hour check if you can place a certain class inside the slot, if there are any students don't add the class to the slot
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


    rows = []
    used_classes = set()

    start_time = None

    # Export the timetable to an excel formula
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
                
    
    return rows


"""
Converts a specific index to a time period, 8am-8pm
"""


def convert_index_to_time(index):
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    day = days[index // 12]
    hour = 8 + (index % 12) 
    if hour < 12:
        time = f'{hour}:00 AM'
    elif hour == 12:
        time = '12:00 PM'
    else:
        time = f'{hour - 12}:00 PM'
    return day, time, hour

"""
Convert int to string format
"""
def convert_num_time(time):
    if time > 12:
        ret = f'{time - 12}:00 PM'
    elif time < 12:
        ret = f'{time}:00 AM'
    else:
        ret = "12:00 PM"
    return ret