// ========================================
// ATTENDANCE TRACKER
// ========================================

// Load saved data
let studentName =
    localStorage.getItem("studentName") || "";

let subjects =
    JSON.parse(
        localStorage.getItem("attendanceSubjects")
    ) || [];


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "studentName",
        studentName
    );

    localStorage.setItem(
        "attendanceSubjects",
        JSON.stringify(subjects)
    );
}


// ========================================
// ADD SUBJECT
// ========================================

function addSubject() {

    const nameInput =
        document.getElementById("yourName");

    const subjectInput =
        document.getElementById("subjectName");

    const dateInput =
        document.getElementById("attendanceDate");

    const name =
        nameInput.value.trim();

    const subjectName =
        subjectInput.value.trim();

    const date =
        dateInput.value;


    if (name === "") {

        alert("Please enter your name.");

        return;
    }


    if (subjectName === "") {

        alert("Please enter a subject name.");

        return;
    }


    if (date === "") {

        alert("Please select a date.");

        return;
    }


    studentName = name;


    const existingSubject =
        subjects.find(
            subject =>
                subject.name.toLowerCase() ===
                subjectName.toLowerCase()
        );


    if (existingSubject) {

        alert("This subject is already added.");

        return;
    }


    subjects.push({

        name: subjectName,

        attendance: []

    });


    saveData();


    subjectInput.value = "";

    dateInput.value = "";

    nameInput.value = studentName;


    displayName();

    displaySubjects();

    updateDashboard();

    updateHistory();
}


// ========================================
// MARK PRESENT / ABSENT
// ========================================

function markAttendance(
    subjectIndex,
    status
) {

    const dateInput =
        document.getElementById(
            "attendanceDate"
        );


    let date = dateInput.value;


    if (date === "") {

        const today = new Date();

        date =
            today.toISOString()
                .split("T")[0];
    }


    const subject =
        subjects[subjectIndex];


    if (!subject) {

        return;
    }


    const existingRecord =
        subject.attendance.find(
            record =>
                record.date === date
        );


    if (existingRecord) {

        existingRecord.status =
            status;

    } else {

        subject.attendance.push({

            date: date,

            status: status

        });
    }


    saveData();


    displaySubjects();

    updateDashboard();

    updateHistory();
}


// ========================================
// DISPLAY SUBJECTS
// ========================================

function displaySubjects() {

    const list =
        document.getElementById(
            "subjectList"
        );


    list.innerHTML = "";


    subjects.forEach(
        function(subject, index) {


            const present =
                subject.attendance.filter(
                    record =>
                        record.status ===
                        "present"
                ).length;


            const absent =
                subject.attendance.filter(
                    record =>
                        record.status ===
                        "absent"
                ).length;


            const total =
                present + absent;


            const percentage =
                total === 0
                    ? 0
                    : Math.round(
                        (present / total) * 100
                    );


            // HISTORY
            let historyHTML = "";


            if (
                subject.attendance.length === 0
            ) {

                historyHTML =
                    "<p>No attendance recorded yet.</p>";

            } else {

                const sortedHistory =
                    [...subject.attendance]
                        .sort(
                            (a, b) =>
                                new Date(b.date) -
                                new Date(a.date)
                        );


                sortedHistory.forEach(
                    function(record) {

                        const formattedDate =
                            new Date(
                                record.date +
                                "T00:00:00"
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }
                            );


                        const status =
                            record.status ===
                            "present"
                                ? "✅ Present"
                                : "❌ Absent";


                        historyHTML += `

                            <div class="history-item">

                                📅 ${formattedDate}
                                —
                                <strong>
                                    ${status}
                                </strong>

                            </div>

                        `;
                    }
                );
            }


            // SUBJECT CARD
            const subjectCard = document.createElement("div");

            subjectCard.className = "student";


            subjectCard.innerHTML = `

                <div>

                    <div class="student-name">

                        📚 ${subject.name}

                    </div>


                    <small>
                        Present: ${present}
                    </small>

                    <br>


                    <small>
                        Absent: ${absent}
                    </small>

                    <br>


                    <small>
                        Total Classes: ${total}
                    </small>

                    <br>


                    <small>
                        Attendance:
                        <strong>
                            ${percentage}%
                        </strong>
                    </small>


                    <div class="progress-container">

                        <div
                            class="progress-bar"
                            style="width:${percentage}%"
                        ></div>

                    </div>


                    ${
                        percentage < 75 &&
                        total > 0

                        ? `

                            <p
                                style="
                                color:#e85d75;
                                margin-top:8px;
                                font-weight:bold;
                                "
                            >

                                ⚠️ Attendance below 75%

                            </p>

                          `

                        : ""
                    }


                    <details>

                        <summary>
                            📅 View History
                        </summary>


                        <div
                            class="subject-history"
                            style="margin-top:10px;"
                        >

                            ${historyHTML}

                        </div>

                    </details>

                </div>


                <div>

                    <button
                        class="present"
                        data-action="present"
                    >
                        ✅ Present
                    </button>


                    <button
                        class="absent"
                        data-action="absent"
                    >
                        ❌ Absent
                    </button>


                    <button
                        class="delete-button"
                        data-action="delete"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            // PRESENT BUTTON
            subjectCard
                .querySelector('[data-action="present"]')
                .addEventListener(
                    "click",
                    function() {

                        markAttendance(
                            index,
                            "present"
                        );

                    }
                );


            // ABSENT BUTTON
            subjectCard
                .querySelector('[data-action="absent"]')
                .addEventListener(
                    "click",
                    function() {

                        markAttendance(
                            index,
                            "absent"
                        );

                    }
                );


            // DELETE BUTTON
            subjectCard
                .querySelector('[data-action="delete"]')
                .addEventListener(
                    "click",
                    function() {

                        deleteSubject(index);

                    }
                );


            list.appendChild(subjectCard);

        }
    );
}


// ========================================
// DELETE SUBJECT
// ========================================
function deleteSubject(index) {
    
    if (index < 0 || index >= subjects.length) {
        return;
    }
    
    // Delete the selected subject
    subjects.splice(index, 1);
    
    // Save the updated subjects
    localStorage.setItem(
        "attendanceSubjects",
        JSON.stringify(subjects)
    );
    
    // Update the screen
    displaySubjects();
    updateDashboard();
    updateHistory();
}


// ========================================
// DISPLAY NAME
// ========================================

function displayName() {

    const nameElement =
        document.getElementById(
            "displayName"
        );


    if (!nameElement) {

        return;
    }


    if (studentName !== "") {

        nameElement.textContent =
            "👤 " +
            studentName +
            "'s Attendance";

    } else {

        nameElement.textContent =
            "Your Attendance";
    }
}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    document.getElementById(
        "totalSubjects"
    ).textContent =
        subjects.length;


    let present = 0;

    let absent = 0;


    subjects.forEach(
        function(subject) {

            subject.attendance.forEach(
                function(record) {

                    if (
                        record.status ===
                        "present"
                    ) {

                        present++;
                    }


                    if (
                        record.status ===
                        "absent"
                    ) {

                        absent++;
                    }

                }
            );

        }
    );


    document.getElementById(
        "totalPresent"
    ).textContent =
        present;


    document.getElementById(
        "totalAbsent"
    ).textContent =
        absent;
}


// ========================================
// HISTORY SUMMARY
// ========================================

function updateHistory() {

    let present = 0;

    let absent = 0;


    subjects.forEach(
        function(subject) {

            subject.attendance.forEach(
                function(record) {

                    if (
                        record.status ===
                        "present"
                    ) {

                        present++;
                    }


                    if (
                        record.status ===
                        "absent"
                    ) {

                        absent++;
                    }

                }
            );

        }
    );


    document.getElementById(
        "historyPresent"
    ).textContent =
        present;


    document.getElementById(
        "historyAbsent"
    ).textContent =
        absent;
}


// ========================================
// START APP
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const nameInput =
            document.getElementById(
                "yourName"
            );


        nameInput.value =
            studentName;


        displayName();

        displaySubjects();

        updateDashboard();

        updateHistory();

    }
);